import { TableComponent } from '@/components/table';
import { getBeneficiaries } from './service';
import { beneficiaryTableHeaders as headerColumns } from '@/config/static';

export default async function Beneficiaries() {
  // const { persons, total } = await getBeneficiaries();
  const response = await getBeneficiaries()
  const persons = !response.error ? response.data.persons : []
  const total = !response.error ? response.data.total : 0

  return (
    <TableComponent
      headerColumns={headerColumns}
      data={persons}
      total={total}
      startPage={1}
      startRowsPerPage={10}
      getData={getBeneficiaries}
      error={response.error}
    />
  );
}
