# 🔒 Security & Code Quality Review — Tanamanku

## Executive Summary

| Category | Status | Notes |
|----------|--------|-------|
| Authentication | ✅ Good | Sanctum tokens, password hashing, inactive account check |
| Authorization | ✅ Good | Policies with ownership checks, role middleware |
| Input Validation | ✅ Good | FormRequest validation, server-side price/stock |
| SQL Injection | ✅ Safe | Eloquent ORM throughout |
| XSS | ✅ Safe | React escapes by default, API-only backend |
| CSRF | ✅ Safe | API uses tokens, not cookies |
| Business Logic | ✅ Good | Server-side calculations, DB transactions |
| Rate Limiting | ✅ Fixed | Global throttle api,60,1 + stricter 5/min on auth endpoints |
| Token Expiry | ✅ Fixed | Sanctum tokens expire after 7 days (10080 min) |
| Error Handling | ✅ Good | Consistent JSON error format |

---

## ✅ Strengths

### 1. Authentication & Password Security
```php
// Password hashed via model cast (never stored in plain text)
protected function casts(): array {
    return ['password' => 'hashed'];
}

// Login checks inactive accounts
if (! $user->is_active) {
    throw ValidationException::withMessages([...]);
}
```

### 2. Server-Side Business Logic
```php
// Total calculated server-side, never from client
$subtotal += $item->quantity * (float) $item->unit_price;
$shippingCost = (float) ($data['shipping_cost'] ?? 15000);

// Price from database, not client
$unitPrice = $this->unitPrice($product, $data['variant_id'] ?? null);
```

### 3. Database Transactions for Critical Operations
```php
// Checkout uses DB transaction
return DB::transaction(function () use ($user, $data) {
    // Stock check → Create order → Reserve stock → Clear cart
});
```

### 4. Ownership Checks via Policies
```php
// OrderPolicy: only owner can view/cancel
public function view(User $user, Order $order): bool {
    return $user->isAdmin() || $order->isOwnedBy($user);
}
```

### 5. Consistent Error Format
```json
{
    "success": false,
    "message": "Error message",
    "errors": { "field": ["Error detail"] }
}
```

---

## ⚠️ Issues Found & Recommendations

### 🔴 Critical

#### 1. No Rate Limiting on Auth Endpoints
**Risk:** Brute force attacks on login, registration spam.

**Fix:** Add rate limiting to `bootstrap/app.php`:

```php
$middleware->api(append: [
    HandleCors::class,
    \Illuminate\Routing\Middleware\ThrottleRequests::class.':api',
]);
```

Or apply per-route:

```php
Route::post('/auth/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1'); // 5 attempts per minute
```

#### 2. Sanctum Tokens Never Expire
**Risk:** Stolen tokens remain valid forever.

**Fix:** Set token expiration in `config/sanctum.php`:

```php
'expiration' => 60 * 24 * 7, // 7 days
```

### 🟡 Medium

#### 3. No CORS Configuration File
**Risk:** Missing or overly permissive CORS.

**Fix:** Create `config/cors.php`:

```php
return [
    'paths' => ['api/*'],
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
    'allowed_methods' => ['*'],
    'allowed_headers' => ['*'],
    'max_age' => 0,
];
```

#### 4. Forgot Password Leaks Email Existence
**Risk:** Attacker can enumerate valid emails.

**Current:** Returns 404 if email not found.

**Fix:** Always return success message:

```php
public function forgotPassword(string $email): void
{
    // Don't reveal if email exists
    User::where('email', $email)->first();
    // Always return same response
}
```

#### 5. No Request Throttling on Password Reset
**Risk:** Email flooding attacks.

**Fix:** Add throttle middleware to forgot-password route.

### 🟢 Low

#### 6. Webhook Signature Verification is Placeholder
```php
// Current: simple secret check
if ($secret && ($payload['secret'] ?? null) !== $secret) {
    abort(403);
}
```

**Fix:** Implement proper HMAC signature verification for production payment gateway.

#### 7. No File Upload Validation on Avatar
**Risk:** Malicious file uploads.

**Current:** FormRequest has `'avatar' => ['nullable', 'image', 'max:2048']` ✅

**Verify:** Ensure storage permissions are correct and files are served securely.

#### 8. Order Number Predictability
```php
'order_number' => 'ORD-'.now()->format('Ymd').'-'.Str::upper(Str::random(6)),
```

**Risk:** Low - random suffix makes it hard to guess, but could use UUID for更强guarantee.

---

## 📋 Code Quality Checklist

### Backend

| Item | Status | Notes |
|------|--------|-------|
| Controllers thin | ✅ | Logic in service classes |
| FormRequest validation | ✅ | All inputs validated |
| Eloquent relationships | ✅ | Proper eager loading |
| Database transactions | ✅ | Checkout, loyalty redeem |
| Soft deletes | ⚠️ | Consider for orders, products |
| API resources | ✅ | Consistent response format |
| Factory + Seeder | ✅ | Development data available |
| Test coverage | ✅ | 271 tests (feature + unit) |

### Frontend (Web)

| Item | Status | Notes |
|------|--------|-------|
| XSS protection | ✅ | React escapes by default |
| API error handling | ✅ | Toast notifications |
| Auth state management | ✅ | Context + localStorage |
| Loading states | ✅ | Skeleton/spinner components |
| Empty states | ✅ | Helpful messages + CTAs |
| Form validation | ✅ | Client + server validation |
| Test coverage | ✅ | 199 tests |

### Architecture

| Item | Status | Notes |
|------|--------|-------|
| Service layer | ✅ | Business logic separated |
| Policy authorization | ✅ | Ownership checks |
| API versioning | ✅ | /api/v1 prefix |
| Error handling | ✅ | Consistent JSON format |
| Logging | ✅ | Laravel log channels |
| Queue jobs | ✅ | Notifications, reminders |
| Scheduler | ✅ | Plant care reminders |

---

## 🔧 Recommended Fixes (Priority Order)

### 1. ~~Add Rate Limiting (Critical)~~ ✅ FIXED

Rate limiting sudah ditambahkan:
- **Global**: `ThrottleRequests::class.':api,60,1'` (60 requests/menit)
- **Auth endpoints**: `throttle:5,1` (5 attempts/menit untuk register & login)
- **Forgot password**: `throttle:3,1` (3 attempts/menit)

### 2. ~~Set Token Expiration (Critical)~~ ✅ FIXED

Sanctum token expiry di-set ke 7 hari (10080 menit) di `config/sanctum.php`:
```php
'expiration' => (int) env('SANCTUM_TOKEN_EXPIRATION', 10080), // 7 hari
```

### 3. ~~Add CORS Config (Medium)~~ ✅ Already present

CORS sudah dikonfigurasi di `config/cors.php` dengan `allowed_origins` dari env `FRONTEND_URL`.

### 4. ~~Fix Password Reset Info Leak (Medium)~~ ✅ Already secure

AuthService sudah tidak mengungkapkan apakah email terdaftar — selalu return success.

### 5. ~~Add Security Headers (Low)~~ ✅ FIXED

Security headers middleware sudah dibuat dan didaftarkan:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Cache-Control: no-store` untuk API
- `Content-Security-Policy: default-src 'none'` untuk API
- `Strict-Transport-Security` untuk HTTPS

---

## 📊 Security Score

| Category | Score | Details |
|----------|-------|---------|
| Authentication | 9/10 | Rate limiting + token expiry configured |
| Authorization | 9/10 | Good ownership checks |
| Input Validation | 9/10 | Comprehensive FormRequests |
| Data Protection | 9/10 | Hashed passwords, no sensitive data exposed |
| API Security | 9/10 | Rate limiting, token expiry, security headers |
| Error Handling | 9/10 | Consistent format, no stack traces |
| Business Logic | 9/10 | Server-side calculations, transactions |
| **Overall** | **9.0/10** | Production-ready |

---

## 🎯 Action Items

1. ~~**[CRITICAL]** Add rate limiting to auth endpoints~~ ✅
2. ~~**[CRITICAL]** Set Sanctum token expiration (7 days)~~ ✅
3. ~~**[MEDIUM]** Create CORS configuration~~ ✅ (already present)
4. ~~**[MEDIUM]** Fix password reset info leak~~ ✅ (already secure)
5. ~~**[LOW]** Add security headers middleware~~ ✅
6. **[LOW]** Implement proper webhook signature verification — for production payment gateway integration
7. **[LOW]** Consider adding audit logging for admin actions
