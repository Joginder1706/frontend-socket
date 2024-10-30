import React, { useState, useEffect } from "react";
import { Modal, Collapse, Switch, Slider, Checkbox, Input, Button, Skeleton } from "antd";
import getCookie from "../utils/getCookie";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
const { Panel } = Collapse;

const InboxFilterModal = ({ isModalVisible, setIsModalVisible, setSuccessMessage }) => {
  // const API_URL = "https://backend-socket-7gmk.onrender.com/api";
  const API_URL = "http://localhost:5000/api";

  const [filtersEnabled, setFiltersEnabled] = useState(false);
  const [profileTypes, setProfileTypes] = useState([]);
  const [ageRange, setAgeRange] = useState([18, 39]);
  const [heightRange, setHeightRange] = useState([0, 60]);
  const [distance, setDistance] = useState(0);
  const [ethnicities, setEthnicities] = useState([]);
  const [minWords, setMinWords] = useState(0);
  const [blockedWords, setBlockedWords] = useState('');
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState("");

  const fetchCats = async () => {
    let { id } = getCookie("loggedin");
    if (!id) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/cats/${id}`,{
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setCategories(response.data.cats_data);
      if (response.data?.filter_data?.length > 0) {
        let data = JSON.parse(response.data.filter_data[0].cat_status);
        setFilterData(data)
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCats();
  }, [])

  useEffect(() => {
    if (filterData) {
      setFiltersEnabled(filterData.isEnable)
    }
    if (filterData?.profileTypes) {
      setProfileTypes([...filterData.profileTypes])
    }
    if (filterData?.ageRange) {
      setAgeRange([...filterData.ageRange])
    }
    if (filterData?.distance > 0) {
      setDistance(filterData.distance)
    }
    if (filterData?.ethnicities?.length > 0) {
      setEthnicities([...filterData.ethnicities])
    }
    if (filterData?.blockedWords?.length > 0) {
      setBlockedWords([...filterData.blockedWords])
    }
    if (filterData?.heightRange?.length > 0) {
      let feet1 = feetInchIntoValue(heightRange[0]);
      let feet2 = feetInchIntoValue(heightRange[1]);
      setHeightRange([feet1, feet2])
    }
  }, [filterData])


  const handleSave = async () => {
    let { id } = getCookie("loggedin");
    if (!id) return;
    let blocked = [];
    if (Array.isArray(blockedWords)) {
      blocked = blockedWords?.filter(word => word.trim() !== '');
    } else if (typeof blockedWords === 'string' && blockedWords) {
      blocked = blockedWords.split(',').map(word => word.trim()).filter(word => word !== '');
    }

    const filterData = {
      isEnable: filtersEnabled,
      profileTypes,
      ageRange,
      heightRange,
      distance,
      ethnicities,
      minWords,
      blockedWords: blocked,
    };

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/filter-data/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filterData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setSuccessMessage(true)
    } catch (error) {
      console.error('Error saving filters:', error);
    } finally {
      setLoading(false)
    }

    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const marks = {
    0: "3'0\"",
    1: "3'1\"",
    2: "3'2\"",
    3: "3'3\"",
    4: "3'4\"",
    5: "3'5\"",
    6: "3'6\"",
    7: "3'7\"",
    8: "3'8\"",
    9: "3'9\"",
    10: "3'10\"",
    11: "3'11\"",
    12: "4'0\"",
    13: "4'1\"",
    14: "4'2\"",
    15: "4'3\"",
    16: "4'4\"",
    17: "4'5\"",
    18: "4'6\"",
    19: "4'7\"",
    20: "4'8\"",
    21: "4'9\"",
    22: "4'10\"",
    23: "4'11\"",
    24: "5'0\"",
    25: "5'1\"",
    26: "5'2\"",
    27: "5'3\"",
    28: "5'4\"",
    29: "5'5\"",
    30: "5'6\"",
    31: "5'7\"",
    32: "5'8\"",
    33: "5'9\"",
    34: "5'10\"",
    35: "5'11\"",
    36: "6'0\"",
    37: "6'1\"",
    38: "6'2\"",
    39: "6'3\"",
    40: "6'4\"",
    41: "6'5\"",
    42: "6'6\"",
    43: "6'7\"",
    44: "6'8\"",
    45: "6'9\"",
    46: "6'10\"",
    47: "6'11\"",
    48: "7'0\"",
    49: "7'1\"",
    50: "7'2\"",
    51: "7'3\"",
    52: "7'4\"",
    53: "7'5\"",
    54: "7'6\"",
    55: "7'7\"",
    56: "7'8\"",
    57: "7'9\"",
    58: "7'10\"",
    59: "7'11\"",
    60: "8'0\"",
  };

  const feetInchesFormatter = (value) => {
    const feet = Math.floor(value / 12) + 3; // Start from 3'
    const inches = value % 12;
    return `${feet}'${inches}`;
  };
  const feetInchIntoValue = (s) => {
    if (typeof s !== 'number') {
      let val = parseInt(s?.split("'")[0]) * 12 + parseInt(s?.split("'")[1]);
      return val;
    }
    return s;
  }

  const milesFormatter = (value) => `${value} miles`;
  const handleHeightChange = (values) => {

    const formattedValues = values.map(feetInchesFormatter);
    setHeightRange(formattedValues);
  };

  if (loading) {
    return (<div className="sm:pt-[30px]" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <FontAwesomeIcon icon={faSpinner} spin style={{ color: 'rgb(188, 0, 47)', fontSize: '25px' }} />
    </div>);
  }

  return (
    <>
      <Modal
        title="Inbox Filters"
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
        className="custom-modal"
      >
        <div>
          <div className="flex justify-between items-center mb-4">
            <span>
              The filters you set below will be applied to allow any new
              messages you receive per your settings below. Messages already in
              your inbox will not be affected.
            </span>
            <Switch checked={filtersEnabled} onChange={setFiltersEnabled} />
          </div>
          <div className=" pl-2 pt-4 pb-4 font-semibold">
            Allowed in Inbox...
          </div>
          <div className={`filter-modal ${filtersEnabled === false ? "blur-filter" : ""}`}>
            <Collapse
              defaultActiveKey={["1"]}
              className="filter-inbox custom-collapse"
            >
              <Panel
                header="Profile Type"
                key="1"
                className="text-md text-black font-semibold"
              >
                <Checkbox.Group className="grid grid-cols-2 gap-4 text-black font-medium"
                  value={profileTypes}
                  onChange={setProfileTypes}>
                  {categories?.length > 0 && categories.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <Checkbox value={item.id} />
                      <span className="ml-2">{item?.name}</span>
                    </div>
                  ))}
                </Checkbox.Group>
              </Panel>

              <Panel
                header="Age"
                key="2"
                className="text-md text-black font-semibold"
              >
                <div className="text-slate-500 font-normal">
                  Display members between the ages of...
                </div>
                <Slider range defaultValue={[18, 39]} min={18} max={99} onChange={setAgeRange} />
              </Panel>

              <Panel
                header="Height"
                key="3"
                className="text-md text-black font-semibold"
              >
                <div className="text-slate-500 font-normal">
                  Displays members with the height between...
                </div>
                <Slider
                  onChange={handleHeightChange}
                  range
                  defaultValue={[0, 60]}
                  min={0}
                  max={60}
                  step={1}
                  tooltip={{
                    formatter: feetInchesFormatter,
                  }}
                  className="mt-4"
                />
              </Panel>

              <Panel
                header="Distance"
                key="4"
                className="text-md text-black font-semibold"
              >
                <div className="text-slate-500 font-normal">
                  Display members that live within...
                </div>
                <Slider
                  defaultValue={0}
                  min={0}
                  max={5000}
                  step={1}
                  tooltip={{
                    formatter: milesFormatter,
                  }}
                  className="mt-4"
                  onChange={setDistance}
                />
              </Panel>

              <Panel
                header="Ethnicity"
                key="5"
                className="text-md text-black font-semibold"
              >
                <Checkbox.Group className="grid grid-cols-2 gap-2"
                  value={ethnicities}
                  onChange={setEthnicities}>
                  <Checkbox value="asian">Asian</Checkbox>
                  <Checkbox value="black">Black</Checkbox>
                  <Checkbox value="caucasian">Caucasian</Checkbox>
                  <Checkbox value="eastern_european">Eastern European</Checkbox>
                  <Checkbox value="east_indian">East Indian</Checkbox>
                  <Checkbox value="hispanic">Hispanic</Checkbox>
                  <Checkbox value="middle_eastern">Middle Eastern</Checkbox>
                  <Checkbox value="native_american">Native American</Checkbox>
                  <Checkbox value="other">Other</Checkbox>
                  <Checkbox value="pacific_islander">Pacific Islander</Checkbox>
                </Checkbox.Group>
              </Panel>

              <Panel
                header="Messaging"
                key="6"
                className="text-md text-black font-semibold"
              >
                <div className="mb-2">
                  <Checkbox checked={minWords > 0} onChange={(e) => setMinWords(e.target.checked ? 1 : 0)}>First message must contain at least</Checkbox>
                  <Input type="number" className="w-16 ml-2 inline-block"
                    value={minWords}
                    onChange={(e) => setMinWords(e.target.value)} />
                  <span> words</span>
                </div>
                <div className="mt-4">
                  <Checkbox>
                    Do not allow messages that contain any of the following words:
                  </Checkbox>
                  <Input placeholder="Separate with commas" className="mt-2" value={blockedWords}
                    onChange={(e) => setBlockedWords(e.target.value)} />
                </div>
              </Panel>
            </Collapse>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default InboxFilterModal;
