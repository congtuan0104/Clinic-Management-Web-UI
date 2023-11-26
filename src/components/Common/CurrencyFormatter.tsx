import { NumberFormatter } from "@mantine/core"

const CurrencyFormatter = ({ value }: { value: number }) => {
  return <NumberFormatter
    suffix="₫"
    value={value}
    thousandSeparator='.'
    decimalSeparator=','
  />
}

export default CurrencyFormatter;