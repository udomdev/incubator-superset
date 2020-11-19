/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { styled, t } from '@superset-ui/core';
import React from 'react';
import { Form, Input, Dropdown, Menu } from 'src/common/components';
import Button from 'src/components/Button';
import FilterConfigurationButton from './FilterConfigurationButton';
import Icon from 'src/components/Icon';
// import FilterScopeModal from 'src/dashboard/components/filterscope/FilterScopeModal';

import {
  useFilterConfiguration,
  useFilterSetter,
  useFilterState,
} from './state';
import { Filter } from './types';

const Bar = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px; // arbitrary...
  flex-grow: 1;
  background: ${({ theme }) => theme.colors.grayscale.light5};
  border-right: 1px solid ${({ theme }) => theme.colors.grayscale.light2};
`;

const TitleArea = styled.h4`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0;
  padding: ${({ theme }) => theme.gridUnit * 4}px;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: ${({ theme }) => theme.gridUnit * 4}px;
  padding-top: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.light2};
  .btn {
    flex: 1 1 50%;
  }
`;

const FilterControls = styled.div`
  padding: ${({ theme }) => theme.gridUnit * 4}px;
`;

interface FilterProps {
  filter: Filter;
}

const FilterValue: React.FC<FilterProps> = ({ filter }) => {
  // THIS ONE IS BUILT TO THROW AWAY
  // this is a temporary POC implementation just to get state hooked up.
  // Please don't send this component to prod.
  const { selectedValues } = useFilterState(filter.id);
  const setSelectedValues = useFilterSetter(filter.id);

  if (selectedValues) {
    return (
      <span>
        {selectedValues.join(', ')}
        <button type="button" onClick={() => setSelectedValues(null)}>
          X
        </button>
      </span>
    );
  }
  return (
    <Form
      onFinish={values => {
        setSelectedValues(values.value);
      }}
    >
      <Form.Item name="value">
        <Input />
      </Form.Item>
      <Button buttonSize="sm" buttonStyle="tertiary" type="submit">
        {t('Apply')}
      </Button>
    </Form>
  );
};

const FilterControl: React.FC<FilterProps> = ({ filter }) => {
  return (
    <div>
      <h3>{filter.name}</h3>
      <FilterValue filter={filter} />
    </div>
  );
};

const menu = (
  <Menu>
    <Menu.Item>Configure Filters</Menu.Item>
    <Menu.Item>
      <FilterConfigurationButton>{t('New Filter')}</FilterConfigurationButton>
    </Menu.Item>
    {/* <Menu.Item>
        <FilterScopeModal
          triggerNode={t('Bulk Scoping')}
        />
      </Menu.Item> */}
  </Menu>
);

const FilterBar: React.FC = () => {
  const filterConfigs = useFilterConfiguration();
  console.log('filterConfigs', filterConfigs);
  return (
    <Bar>
      <TitleArea>
        <span>Filters ({filterConfigs.length})</span>
        <Dropdown overlay={menu}>
          <Icon name="more-horiz" />
        </Dropdown>
      </TitleArea>
      <ActionButtons>
        <Button buttonStyle="primary" type="submit" buttonSize="sm">
          {t('Apply')}
        </Button>
        <Button buttonStyle="secondary" buttonSize="sm">
          {t('Reset All')}
        </Button>
      </ActionButtons>
      <FilterControls>
        {filterConfigs.map(filter => (
          <FilterControl key={filter.id} filter={filter} />
        ))}
      </FilterControls>
    </Bar>
  );
};

export default FilterBar;
