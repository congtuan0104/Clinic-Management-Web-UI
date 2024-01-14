import { MRT_Localization_VI } from '@/config';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_RowData, //default shape of TData (Record<string, any>)
  type MRT_TableOptions,
  MRT_Icons,
} from 'mantine-react-table';
import { MantineProvider, MantineTheme, createTheme } from '@mantine/core';
import { FaSort } from 'react-icons/fa6';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { MdModeEdit } from 'react-icons/md';

interface Props<TData extends MRT_RowData> extends MRT_TableOptions<TData> {
  columns: MRT_ColumnDef<TData>[];
  data: TData[];
}

const customeTableTheme = createTheme({
  primaryShade: 7,
});

const customTableIcons: Partial<MRT_Icons> = {
  IconArrowsSort: (props: any) => (
    <FaSort color='gray' {...props} />
  ),
  IconSortAscending: (props: any) => (
    <FaSortAmountUp color='gray' {...props} />
  ),
  IconSortDescending: (props: any) => (
    <FaSortAmountDown color='gray' {...props} />
  ),
  IconEdit: (props: any) => <MdModeEdit {...props} />,
}


const ClinusTable = <TData extends MRT_RowData>({
  columns,
  data,
  ...rest
}: Props<TData>) => {
  const table = useMantineReactTable({
    columns,
    data,
    localization: MRT_Localization_VI,
    icons: customTableIcons,
    // enableColumnResizing: true,
    // columnFilterDisplayMode: 'popover',
    // positionGlobalFilter: 'right',
    enableColumnPinning: true,
    enableFullScreenToggle: false,
    mantineFilterTextInputProps: {
      style: { borderBottom: 'unset' },
      className: '!mt-2',
      radius: 'md',
      variant: 'filled',
    },
    mantineFilterSelectProps: {
      style: { borderBottom: 'unset', marginTop: '8px' },
      variant: 'filled',
      radius: 'md',
    },
    paginationDisplayMode: 'pages',
    // mantinePaginationProps: {
    //   radius: 'md',
    //   variant: 'outline',
    //   color: 'gray',
    //   checkIconPosition: 'right',
    // },
    positionActionsColumn: 'last',
    enableRowNumbers: true,
    positionToolbarAlertBanner: 'bottom',
    ...rest,
  });

  return (
    <MantineProvider theme={customeTableTheme}>
      <MantineReactTable table={table} />
    </MantineProvider>
  )
};

export default ClinusTable;