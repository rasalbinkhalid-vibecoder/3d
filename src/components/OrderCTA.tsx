interface OrderCTAProps {
  primary: string
  secondary: string
}

export function OrderCTA({ primary, secondary }: OrderCTAProps) {
  return (
    <div className="order-cta-row">
      <a href="#order" className="btn btn-primary">
        {primary} →
      </a>
      <a href="#menu" className="btn btn-ghost">
        {secondary}
      </a>
    </div>
  )
}
