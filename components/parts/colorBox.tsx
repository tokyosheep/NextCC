import styled from 'styled-components';

import { CMYK, RGB } from '../../types/color';

export const ColorBox = styled.div<{width:number,height:number,color:RGB}>`
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    background: ${props => `rgb(${props.color.r},${props.color.g},${props.color.b})`};
    border-radius: 5px;
`;
