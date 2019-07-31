import React from 'react';
import { RecordModel } from '../../store/models';
import { VirtualTable } from '../common';
import { InfiniteLoader } from 'react-virtualized';

export interface InfiniterecordTableProps {
  records: RecordModel[];
  onLoadMore: () => Promise<any>;
}

export const InfiniteRecordTable: React.FC<InfiniterecordTableProps> = ({records, onLoadMore}) => {
  return (
    <InfiniteLoader
      loadMoreRows={onLoadMore}
      isRowLoaded={({index}) => !!records[index]}
      rowCount={100000}
    >
      {({onRowsRendered, registerChild}) => (
        <VirtualTable
          innerRef={registerChild}
          onRowsRendered={onRowsRendered}
          rowCount={records.length}
          rowGetter={({index}: any) => records[index]}
          columns={[
            {
              label: 'Time',
              dataKey: 'time',
            },
            {
              label: 'Record',
              dataKey: 'record',
              numeric: true,
            },
          ]}
        />
      )}
    </InfiniteLoader>
  )
};
