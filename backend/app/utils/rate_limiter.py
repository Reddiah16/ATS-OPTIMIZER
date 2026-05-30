import time
from collections import defaultdict
from fastapi import Request, HTTPException, status
from loguru import logger


class RateLimitRule:
    def __init__(self, limit: int, window: int):
        self.limit = limit
        self.window = window
        self.history = defaultdict(list)


class RateLimiterDependency:
    def __init__(self, limit: int, window: int, scope: str = "global"):
        """
        limit: Max number of requests allowed within the window.
        window: Sliding window size in seconds.
        scope: Name of the rate limit scope (e.g. 'auth', 'AI', 'upload').
        """
        self.rule = RateLimitRule(limit, window)
        self.scope = scope

    def __call__(self, request: Request):
        # 1. Resolve unique key for client throttling
        # Fall back to client host IP
        client_ip = request.client.host if request.client else "unknown"
        
        # Override with Authorization token if present (ensuring user-based limits rather than just IP)
        client_key = client_ip
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            client_key = auth_header

        now = time.time()

        # 2. Filter sliding window history to remove stale timestamps
        self.rule.history[client_key] = [
            t for t in self.rule.history[client_key]
            if now - t < self.rule.window
        ]

        # 3. Check threshold violation
        current_hits = len(self.rule.history[client_key])
        if current_hits >= self.rule.limit:
            oldest_t = self.rule.history[client_key][0]
            retry_after = int(self.rule.window - (now - oldest_t))
            retry_after = max(1, retry_after)

            # Security Monitoring Hook: Log potential DoS/brute force if traffic exceeds 2x threshold
            if current_hits >= self.rule.limit * 2:
                logger.error(
                    f"SECURITY MONITORING HOOK [ALERT]: Suspicious brute force / spam behavior detected! "
                    f"Client IP: {client_ip} has exceeded the {self.scope} rate limit by 2x. "
                    f"Path requested: {request.url.path}"
                )
            else:
                logger.warning(
                    f"Rate limit hit for Client: {client_ip} | Scope: {self.scope} | "
                    f"Path: {request.url.path} | Hits: {current_hits}/{self.rule.limit}. Throttling for {retry_after}s"
                )

            headers = {"Retry-After": str(retry_after)}
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Please retry after {retry_after} seconds.",
                headers=headers
            )

        # 4. Record new request timestamp
        self.rule.history[client_key].append(now)
