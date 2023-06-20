import cx from 'classnames';
import styles from './index.module.css';

type Props = {
  className?: string;
  value: number;
  total: number;
};

export const Progress = ({ className, value, total }: Props) => {
  return (
    <div className={cx(styles.root, className)}>
      <div
        className={styles.value}
        style={{ width: `${(value / total) * 100}%` }}></div>
      <div className={styles.text}>
        {value} / {total}
      </div>
    </div>
  );
};
