import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native';

export const Loading = styled(ActivityIndicator).attrs({
  color: '#7159c1',
  size: 100,
})`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;
