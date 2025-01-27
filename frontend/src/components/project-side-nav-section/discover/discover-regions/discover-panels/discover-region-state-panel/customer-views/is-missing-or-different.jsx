import React from 'react';
import { isEmpty } from '../../../../../../../utils/utils';
import { DiscoverCustomerViewChange } from './styled';

function isMissingOrDifferent(fieldValue, hasDifference, isFuture, hasPair) {
  if (isEmpty(fieldValue)) {
    return '-';
  }

  if (!isEmpty(hasDifference)) {
    if (isFuture && hasPair) {
      return <DiscoverCustomerViewChange>{fieldValue}</DiscoverCustomerViewChange>;
    }
  }

  return fieldValue;
}

export default isMissingOrDifferent;
