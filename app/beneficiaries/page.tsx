import { TableComponent } from '@/components/table';
import { getBeneficiaries } from './service';
import { beneficiaryTableHeaders as headerColumns } from '@/config/static';

export default async function Beneficiaries() {
  const { persons, total } = await getBeneficiaries();

  return (
    <TableComponent
      headerColumns={headerColumns}
      data={persons}
      total={total}
      startPage={1}
      startRowsPerPage={10}
      getData={getBeneficiaries}
    />
  );
}
