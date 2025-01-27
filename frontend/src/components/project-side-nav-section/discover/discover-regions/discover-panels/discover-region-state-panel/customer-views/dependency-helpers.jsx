import React from 'react';
import { DiscoverCustomerViewChange } from './styled';

export function hasFutureChanged(item, dependency, hasPair, isFuture, differences) {
  return !((differences?.extras || {})?.[dependency]?.old || []).includes(item) && hasPair && isFuture;
}

export function joinJSXWithReduce(acc, crr, index, list) {
  acc.push(crr);
  if (index % 2 === 0 && index + 1 !== list.length) {
    acc.push(', ');
  }
  return acc;
}

export function reduceDependency(dependencyName, hasPair, isFuture, differences, projectDetails) {
  return function (acc, crr) {
    const hasChanged = hasFutureChanged(crr, dependencyName, hasPair, isFuture, differences);
    const named = (projectDetails || []).find(detail => detail.id === crr)?.named;
    const value = hasChanged ? <DiscoverCustomerViewChange>{named}</DiscoverCustomerViewChange> : named;
    acc.push(value);
    return acc;
  };
}
