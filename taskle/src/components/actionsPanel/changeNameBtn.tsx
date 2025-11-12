interface ChangeNameBtnProps {
  bp: boolean
  className: string
  text1: string
  text2: string
  onClick: () => void
}
export default function ChangeNameBtn({
  bp,
  className,
  text1,
  text2,
  onClick,
}: ChangeNameBtnProps) {
  return (
    <button className={className} onClick={onClick}>
      {bp ? text1 : text2}
    </button>
  )
}
