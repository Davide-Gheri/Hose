import React from 'react';
import { WateringModel } from '../../store/models/watering.model';
import { VirtualTable } from '../common';
import { InfiniteLoader } from 'react-virtualized';

export interface InfiniteWateringTableProps {
  waterings: WateringModel[];
  onLoadMore: () => Promise<any>;
}

export const InfiniteWateringTable: React.FC<InfiniteWateringTableProps> = ({waterings, onLoadMore}) => {
  return (
    <InfiniteLoader
      loadMoreRows={onLoadMore}
      isRowLoaded={({index}) => !!waterings[index]}
      rowCount={100000}
    >
      {({onRowsRendered, registerChild}) => (
        <VirtualTable
          innerRef={registerChild}
          onRowsRendered={onRowsRendered}
          rowCount={waterings.length}
          rowGetter={({index}: any) => waterings[index]}
          columns={[
            {
              label: 'Created at',
              dataKey: 'createdAt',
            },
            {
              label: 'Processed at',
              dataKey: 'processedAt',
            },
          ]}
        />
      )}
    </InfiniteLoader>
  )
};
