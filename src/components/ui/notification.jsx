import { notification } from 'antd';

export const showNotification = ({
  type = 'info', // 'success', 'error', 'warning', 'info'
  message = '',
  description = '',
  placement = 'topRight',
  duration = 3,
}) => {
  notification[type]({
    message,
    description,
    placement,
    duration,
  });
};