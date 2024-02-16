import { MRT_Localization_VI } from '@/config';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_RowData, //default shape of TData (Record<string, any>)
  type MRT_TableOptions,
  MRT_Icons,
  MRT_Localization,
} from 'mantine-react-table';
import { MantineProvider, MantineTheme, createTheme } from '@mantine/core';
import { FaSort } from 'react-icons/fa6';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { MdModeEdit } from 'react-icons/md';

interface Props<TData extends MRT_RowData> extends MRT_TableOptions<TData> {
  columns: MRT_ColumnDef<TData>[];
  data: TData[];
  localization?: Partial<MRT_Localization>;
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
  localization,
  ...rest
}: Props<TData>) => {
  const table = useMantineReactTable({
    // enableColumnResizing: true,
    // columnFilterDisplayMode: 'popover',
    columns,
    data,
    localization: { ...MRT_Localization_VI, ...localization },
    icons: customTableIcons,
    enableColumnPinning: true,
    enableFullScreenToggle: false,
    paginationDisplayMode: 'pages',
    enableFilterMatchHighlighting: true,
    enableRowNumbers: true,
    positionGlobalFilter: 'left',
    positionActionsColumn: 'last',
    positionToolbarAlertBanner: 'bottom',
    initialState: {
      showGlobalFilter: true, //show the global filter by default
    },
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
    mantineSearchTextInputProps: {
      styles: { wrapper: { width: '300px' } },
      radius: 'md',
    },
    mantinePaginationProps: {
      color: 'primary.3',
    },
    mantinePaperProps: {
      radius: 'md',
    },
    ...rest,
  });

  return (
    <MantineProvider theme={customeTableTheme}>
      <MantineReactTable table={table} />
    </MantineProvider>
  )
};

export default ClinusTable;