// ErrorMessage.jsx
import '@src/styles/global.css'

export default function ErrorMessage({ message }) {
  if (!message) return null

  return (
    <div className="error-container">
      <span className="error-icon">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="red"
          >
            <path d="M12 2L1 21h22L12 2zm0 14h-1v-4h2v4h-1zm0 4h-1v-2h2v2h-1z"/>
          </svg>
      </span>
      <span className="error-text">{message}</span>
    </div>
  )
}