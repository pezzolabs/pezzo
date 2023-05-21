export interface InfluxQueryResult {
  result: string;
  table: number;
  _start: string;
  _stop: string;
  _time: string;
  _value: number;
  _field: string;
  _measurement: string;
}
