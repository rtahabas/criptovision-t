import { useCallback, useMemo, useState } from "react";

export const useForm = ({ fields, initialValues, onSubmit }) => {
  const initialState = useMemo(() => {
    if (initialValues) return initialValues;

    return fields.reduce((acc, field) => {
      acc[field.key] = "";
      return acc;
    }, {});
  }, [fields, initialValues]);

  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((key, value) => {
    const field = fields.find((f) => f.key === key);
    const trimmed = String(value ?? "").trim();

    if (field?.required && !trimmed) {
      return `${field.label} is required`;
    }

    if (field?.validate) {
      return field.validate(trimmed, values);
    }

    return "";
  }, [fields, values]);


  const validateForm = useCallback(() => {
    const newErrors = {};

    fields.forEach((field) => {
      newErrors[field.key] = validateField(field.key, values[field.key]);
    });

    setErrors(newErrors);

    return Object.values(newErrors).some(Boolean);
  }, [fields, validateField, values]);

  const handleChange = useCallback(
    (key, value) => {
      setValues((prev) => ({ ...prev, [key]: value }));

      setErrors((prev) => ({
        ...prev,
        [key]: validateField(key, value),
      }));
    },
    [validateField]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault?.();

      const hasErrors = validateForm();
      if (hasErrors) return;

      try {
        setIsSubmitting(true);

        const sanitizedData = Object.fromEntries(
          Object.entries(values).map(([k, v]) => [k, String(v).trim()])
        );

        await onSubmit?.(sanitizedData);
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateForm, values, onSubmit]
  );

  const reset = useCallback(() => {
    setValues(initialState);
    setErrors(initialState);
  }, [initialState]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
  };
};