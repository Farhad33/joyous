import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import moment from 'moment-timezone'
import dummyData from './dummyData'
import { processAvailabilityData } from './utils'

const API_KEY = 'cal_35a24cadf3e7c1d3903dedd68ab93611'
const teamId = 1
const BASE_URL = 'http://localhost:3002/v1'

export default function Calendar() {
  const [selectedDay, setSelectedDay] = useState(null)
  const [availabilityData, setAvailabilityData] = useState(dummyData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const now = moment().format('YYYY-MM-DD')
  const oneWeekFromNow = moment().add(3, 'weeks').format('YYYY-MM-DD')
  const endPoint = `${BASE_URL}/teams/${teamId}/availability?apiKey=${API_KEY}&dateFrom=${now}&dateTo=${oneWeekFromNow}`

  useEffect(() => {
    const getTeamAvailability = async () => {
      setLoading(true)
      try {
        const response = await fetch(endPoint)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setAvailabilityData(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    // if the API is running we can uncomment this line
    // getTeamAvailability()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  const dayToTimesMap = processAvailabilityData(availabilityData[0].availability)

  return (
    <ScheduleWrapper>
      <DayColumn>
        <Header>SELECT A DAY</Header>
        <ScrollColumn>
          {Object.keys(dayToTimesMap).map(day => (
            <DayButton
              key={day}
              onClick={() => setSelectedDay(day)}
              $selected={selectedDay === day}
            >
              {day}
            </DayButton>
          ))}
        </ScrollColumn>
      </DayColumn>
      <TimeColumn>
        <Header>TIME</Header>
        <ScrollColumn>
          {selectedDay &&
            dayToTimesMap[selectedDay].map(time => (
              <TimeButton key={time}>{time}</TimeButton>
            ))}
        </ScrollColumn>
      </TimeColumn>
    </ScheduleWrapper>
  )
}


const ScheduleWrapper = styled.div`
  display: flex;
  width: 400px;
  height: 50vh;
  margin: 50px auto;
  border: 1px solid #ddd;
`
const DayColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  overflow-y: scroll;
  border-right: 1px solid #ddd;
`
const TimeColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`
const ScrollColumn = styled.div`
  overflow-y: scroll;
`
const TimeButton = styled.div`
  padding: 15px;
  background-color: white;
  border-bottom: 1px solid #ddd;
  &:last-child {
    border-bottom: none;
  }
`
const DayButton = styled(TimeButton)`
  color: ${({ $selected }) => $selected ? '#8e7cc3' : '#000'};
  cursor: pointer;
  &:hover {
    background-color: #e7e7e7;
  }
`
const Header = styled.h5`
  text-align: center;
  position: sticky;
  top: 0;
  background-color: white;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #ddd;
`