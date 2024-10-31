import React, { useEffect, useState } from 'react';
import { Button } from '../index';
import path from '../../utils/path';
import { getAllSkill } from '../../apis/SkillServices';
import { DatePicker, Select } from 'antd';
import { useUserStore } from '../../store/useUserStore';

const Search = ({ searchFor, setPayload }) => {
  const { RangePicker } = DatePicker;
  const [skills, setSkills] = useState([]);
  const { role } = useUserStore();
  useEffect(() => {
    const fetchAllSkill = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await getAllSkill('', token);
        setSkills(response?.data?.skillsDTOList);
      } catch (error) {}
    };
    fetchAllSkill();
  }, []);

  const onOk = value => {
    setPayload(preData => ({ ...preData, date: value }));
  };

  const handleOnChanges = e => {
    const { name, value } = e.target;
    setPayload(preData => ({ ...preData, [name]: value }));
    // console.log(payload);
  };

  const handleDateChange = dateStrings => {
    setPayload(preData => ({ ...preData, date: dateStrings }));
  };

  const handleSkillChange = value => {
    setPayload(preData => ({ ...preData, skill: value }));
  };

  const handleSubmit = () => {
    // console.log(payload);
  };

  return (
    <div className="flex w-full gap-3 h-[7vh] p-2 bg-[#F5F5F5] rounded-md">
      <input
        className="rounded-md w-1/5 text-lg p-1"
        type="input"
        placeholder="Name"
        name="name"
        onChange={handleOnChanges}
      />

      {searchFor !== 'mentor' && (
        <input
          className="rounded-md w-1/5 text-lg p-1"
          type="input"
          placeholder="Expertise"
          name="expertise"
          onChange={handleOnChanges}
        />
      )}
      {searchFor === 'mentor' && (
        <Select
          mode="multiple"
          placeholder="Select skills"
          className="rounded-md w-2/5 text-lg overflow-y-auto"
          onChange={handleSkillChange}
        >
          {skills?.map(skill => (
            <Select.Option key={skill.id} value={skill.name}>
              {skill.skillName}
            </Select.Option>
          ))}
        </Select>
      )}
      {searchFor === 'mentor' && role === 'STUDENT' && (
        <RangePicker
          showTime={{
            format: 'HH:mm'
          }}
          format="DD-MM-YYYY HH:mm"
          onChange={handleDateChange}
        />
      )}

      {
        <Button
          text={'Search'}
          textColor={'text-white'}
          bgColor={'bg-main-1'}
          bgHover={'hover:bg-main-2'}
          fullWidth={'w-1/12'}
          htmlType={'button'}
          onClick={handleSubmit}
        />
      }
    </div>
  );
};

export default Search;
