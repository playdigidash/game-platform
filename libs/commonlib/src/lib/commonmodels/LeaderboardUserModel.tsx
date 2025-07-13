export interface ILeaderboardUserModel  {
  name: string
  points: number
  previousDayRank: number
  previousWeek: number | null
  previousMonthRank: number | null
  icon: string | null 
  currentRank: number | null
  id: string | null
}
