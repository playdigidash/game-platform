import styles from './aws.module.scss';

/* eslint-disable-next-line */
export interface AwsProps {}

export function Aws(props: AwsProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Aws!</h1>
    </div>
  );
}

export default Aws;
