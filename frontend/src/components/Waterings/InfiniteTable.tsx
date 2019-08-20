import React from 'react';
import { WateringModel } from '../../store/models/watering.model';
import { VirtualTable } from '../common';
import { InfiniteLoader } from 'react-virtualized';
import { useTranslation } from 'react-i18next';

export interface InfiniteWateringTableProps {
  waterings: WateringModel[];
  onLoadMore: () => Promise<any>;
}

export const InfiniteWateringTable: React.FC<InfiniteWateringTableProps> = ({waterings, onLoadMore}) => {
  const { t } = useTranslation();

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
              label: t('common:created_at'),
              dataKey: 'createdAt',
            },
            {
              label: t('watering:processed_at'),
              dataKey: 'processedAt',
            },
          ]}
        />
      )}
    </InfiniteLoader>
  )
};
