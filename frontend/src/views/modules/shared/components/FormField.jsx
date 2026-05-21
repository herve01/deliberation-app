import React from "react";

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  options = [],
}) {
  return (
    <div className="form-group">
      <label>{label}</label>

      {type === "select" ? (
        <select value={value} onChange={onChange} className="form-control">
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="form-control"
        />
      )}
    </div>
  );
}