
interface Props {
   first_name: string
   second_name: string
   last_name: string
   mothers_last_name: string
}

export default function fullName({first_name, second_name, last_name, mothers_last_name}:Props) {
   return `${first_name ?? ''}  ${second_name ?? ''} ${last_name ?? ''} ${mothers_last_name ?? ''}`
}