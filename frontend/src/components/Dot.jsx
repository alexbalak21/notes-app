import { styled } from "@mui/material";

const Dot = styled('span')(({ color }) => ({
  display: 'inline-block',
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: color,
  flexShrink: 0
}));

export default Dot;
