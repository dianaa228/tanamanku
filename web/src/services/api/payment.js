import { api, apiMode, delay } from './client'

/**
 * Payment service — Midtrans Snap integration.
 * 
 * Flow:
 * 1. Frontend sends order data to backend
 * 2. Backend creates transaction with Midtrans API → returns snap_token
 * 3. Frontend loads Snap.js → calls snap.pay(snapToken)
 * 4. Midtrans handles payment UI
 * 5. Callback fires on success/pending/error
 * 
 * Mock mode: simulates the entire flow locally.
 */

// Midtrans client key (for Snap.js)
export const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-XXXXX'
export const MIDTRANS_IS_SANDBOX = import.meta.env.VITE_MIDTRANS_SANDBOX !== 'false'

// Snap.js URL
export const SNAP_JS_URL = MIDTRANS_IS_SANDBOX
  ? 'https://app.sandbox.midtrans.com/snap/snap.js'
  : 'https://app.midtrans.com/snap/snap.js'

/**
 * Load Midtrans Snap.js dynamically
 */
export function loadSnapJs() {
  return new Promise((resolve, reject) => {
    // Already loaded
    if (window.snap) {
      resolve(window.snap)
      return
    }
    
    const existing = document.querySelector(`script[src="${SNAP_JS_URL}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(window.snap))
      existing.addEventListener('error', reject)
      return
    }

    const script = document.createElement('script')
    script.src = SNAP_JS_URL
    script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY)
    script.onload = () => resolve(window.snap)
    script.onerror = () => reject(new Error('Gagal memuat Midtrans Snap.js'))
    document.head.appendChild(script)
  })
}

/**
 * Create payment via backend API
 * Backend will call Midtrans API to create transaction and return snap_token
 */
export async function createPayment(orderData) {
  if (apiMode() === 'api') {
    const res = await api.post('/payments/create', orderData)
    return { success: true, data: res.data }
  }

  // Mock: simulate payment creation
  await delay(800)
  const mockToken = 'mock-snap-token-' + Date.now()
  const orderId = 'ORD-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + String(Math.floor(Math.random() * 999)).padStart(3, '0')

  return {
    success: true,
    data: {
      token: mockToken,
      redirect_url: null,
      order_id: orderId,
    },
  }
}

/**
 * Process payment with Snap.js (popup mode)
 * @param {string} snapToken - Token from createPayment
 * @param {object} callbacks - { onSuccess, onPending, onError, onClose }
 */
export async function processPayment(snapToken, callbacks = {}) {
  const { onSuccess, onPending, onError, onClose } = callbacks

  // Mock mode: simulate payment success
  if (apiMode() === 'mock' || !window.snap) {
    await delay(1500)
    const mockResult = {
      status_code: '200',
      status_message: 'Success, transaction is found',
      transaction_id: 'mock-tx-' + Date.now(),
      order_id: 'ORD-' + Date.now(),
      gross_amount: '150000.00',
      payment_type: 'bank_transfer',
      transaction_time: new Date().toISOString(),
      transaction_status: 'capture',
      fraud_status: 'accept',
    }
    if (onSuccess) onSuccess(mockResult)
    return mockResult
  }

  // Real mode: use Snap.js
  try {
    const snap = await loadSnapJs()
    return new Promise((resolve, reject) => {
      snap.pay(snapToken, {
        onSuccess: (result) => {
          if (onSuccess) onSuccess(result)
          resolve(result)
        },
        onPending: (result) => {
          if (onPending) onPending(result)
          resolve(result)
        },
        onError: (result) => {
          if (onError) onError(result)
          reject(result)
        },
        onClose: () => {
          if (onClose) onClose()
          resolve(null)
        },
      })
    })
  } catch (err) {
    if (onError) onError(err)
    throw err
  }
}

/**
 * Check payment status
 */
export async function checkPaymentStatus(orderId) {
  if (apiMode() === 'api') {
    const res = await api.get(`/payments/${orderId}/status`)
    return { success: true, data: res.data }
  }

  // Mock: always return success
  await delay(500)
  return {
    success: true,
    data: {
      order_id: orderId,
      transaction_status: 'capture',
      payment_status: 'paid',
    },
  }
}

/**
 * Available payment methods for display
 */
export const PAYMENT_METHODS = [
  { id: 'bank_transfer', name: 'Transfer Bank', icon: '🏦', desc: 'BCA, BRI, BNI, Mandiri' },
  { id: 'echannel', name: 'Virtual Account', icon: '🏧', desc: 'Semua bank VA' },
  { id: 'gopay', name: 'GoPay', icon: '💚', desc: 'Bayar dengan GoPay' },
  { id: 'shopeepay', name: 'ShopeePay', icon: '🛒', desc: 'Bayar dengan ShopeePay' },
  { id: 'qris', name: 'QRIS', icon: '📱', desc: 'Scan QR dari semua e-wallet' },
  { id: 'indomaret', name: 'Indomaret', icon: '🏪', desc: 'Bayar di Indomaret' },
  { id: 'alfamart', name: 'Alfamart', icon: '🏬', desc: 'Bayar di Alfamart' },
  { id: 'credit_card', name: 'Kartu Kredit', icon: '💳', desc: 'Visa, Mastercard, JCB' },
]

export default {
  loadSnapJs,
  createPayment,
  processPayment,
  checkPaymentStatus,
  PAYMENT_METHODS,
  MIDTRANS_CLIENT_KEY,
  SNAP_JS_URL,
}
