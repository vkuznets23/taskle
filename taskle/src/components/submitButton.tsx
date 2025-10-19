interface SubmitButtonProps {
  text1: string
  text2: string
  submit: boolean
}

export default function SubmitButton({
  text1,
  text2,
  submit,
}: SubmitButtonProps) {
  return (
    <button className="form-submit-btn" type="submit">
      {submit ? text1 : text2}
    </button>
  )
}
