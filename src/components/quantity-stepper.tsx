import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Props = {
    quantity: number
    onChange: (value: number) => void
  }

export function QuantityStepper({quantity, onChange}: Props) {

  const increase = () => onChange(quantity + 1)
  const decrease = () => onChange(Math.max(1, quantity - 1))

  return (
    <div className="flex items-center gap-2">
      <Button size="icon" variant="outline" onClick={decrease}>
        &lt;
      </Button>
      <Input
        type="number"
        value={quantity}
        onChange={(e) => onChange(Math.max(1, Number(e.target.value)))}
        className="w-16 text-center"
      />
      <Button size="icon" variant="outline" onClick={increase}>
      &gt;
      </Button>
    </div>
  )
}

