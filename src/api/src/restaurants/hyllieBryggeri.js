export const name = 'Hyllie Bryggeri'
export const url = 'https://hylliebryggeri.se/stormgatan'
export const emoji = 'beer'

/**
 * @returns {Promise<Course[]>}
 */
export async function scrape() {
  const response = await fetch('https://xvfynakyjzmckotiykww.supabase.co/rest/v1/lunch_menus?select=week_number,monday,tuesday,wednesday,thursday,friday,vegetarian,fish,monday_en,tuesday_en,wednesday_en,thursday_en,friday_en,vegetarian_en,fish_en,monday_de,tuesday_de,wednesday_de,thursday_de,friday_de,vegetarian_de,fish_de,monday_da,tuesday_da,wednesday_da,thursday_da,friday_da,vegetarian_da,fish_da&location=eq.stormgatan', {
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZnluYWt5anptY2tvdGl5a3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MzQ0MjEsImV4cCI6MjA5NjQxMDQyMX0.Yuc5npMGj5cTMZqawLOdJEawXDDgMD9A9xH5TcayfZw'
    }
  })

  if (!response.ok) throw new Error('Request to Hyllie Bryggeri API failed')

  const result = await response.json()
  const data = result[0]

  /** @type {{ [key: string]: string }} */
  const dayIndexToText = {
    '1': 'monday',
    '2': 'tuesday',
    '3': 'wednesday',
    '4': 'thursday',
    '5': 'friday'
  }

  const dayAsText = /** @type {string} */ (dayIndexToText[new Date().getDay()])
  const todaysMenu = data[dayAsText]

  return [
    { diet: 'all', desc: todaysMenu },
    { diet: 'veg', desc: data.vegetarian }
  ]
}

