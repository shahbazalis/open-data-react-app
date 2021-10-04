import { useState, useEffect } from "react";
import { getDataHistory, getSensorData, addDataToDb } from "../models/apis";
import LineChart from "./LineChart";
import moment from "moment";
import { setStorageData } from "../utility/StorageSession";

export default function MainPage() {
  const [sensorData, setSensorData] = useState<any>({ sdata: [] });
  useEffect(() => {
    (async () => {
      try {
        const sensorDataHistory = await getDataHistory();
        await setSensorData(sensorDataHistory);
        setSensorData((prevState: any) => {
          return { ...prevState, sdata: sensorDataHistory };
        });

        const id = await setInterval(getDataHistoryDetails, 3600 * 1000);
        await setStorageData("intervalId", id);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const getDataHistoryDetails = async () => {
    try {
      const newSensorData = await getSensorData();
      await addDataToDb(newSensorData);

      console.log(sensorData, newSensorData);
      setSensorData((prevState: any) => {
        return { ...prevState, sdata: prevState.sdata.concat([newSensorData]) };
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {}, [sensorData]);

  return (
    <div>
      <LineChart
        date={
          sensorData?.sdata &&
          sensorData.sdata
            .map((sdata: any) => moment(sdata.date).format("hh:mm"))
            .slice(-10)
        }
        sensor1={
          sensorData?.sdata &&
          sensorData.sdata
            .map((sdata: any) => sdata.sensor1).slice(-10)
        }
        sensor2={
          sensorData?.sdata &&
          sensorData.sdata
          .map((sdata: any) => sdata.sensor2).slice(-10)
        }
        sensor3={
          sensorData?.sdata &&
          sensorData.sdata
          .map((sdata: any) => sdata.sensor3).slice(-10)
        }
        sensor4={
          sensorData?.sdata &&
          sensorData.sdata
            .map((sdata: any) => sdata.sensor4).slice(-10)
        }
      />
    </div>
  );
}
