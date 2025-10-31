import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import Header from 'components/Header';
import type { Route } from './+types/createTrips';
import { comboBoxItems, selectItems } from '~/constants';
import { cn, formatKey } from '~/lib/utils';
import { LayerDirective, LayersDirective, MapsComponent } from '@syncfusion/ej2-react-maps';
import { useState } from 'react';
import { world_map } from '~/constants/world_map';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { account } from '~/appwrite/client';

import countryData from '../../lib/country.json'; 
import { useNavigate } from 'react-router';

export function loader() {

    const data = countryData;

    // Check response validity
    // if not working on machine probably the request from node.js is being blocked.
    return data.map((country: any) => ({
      name: country.name.common,
      coordinates: country.latlng,
      value: country.name.common,
      openStreetMap: country.maps?.openStreetMaps,
    })) as Country[];

}


const createTrips = ({loaderData}: Route.ComponentProps) => {
  const countries = loaderData as Country[];
  const navigate = useNavigate();
  
  const [formData, setformData] = useState<TripFormData>({
    country: countries[0]?.name || '',
    travelStyle: '',
    interest: '',
    budget: '',
    duration: 0,
    groupType: '',
   });
   const [error, setError] = useState<string | null>(null);
   const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if(!formData.country || !formData.budget || !formData.groupType || !formData.interest || !formData.travelStyle){
      setError('Please provide values for all fields');
      setLoading(false);
      return;
    }

    if(formData.duration < 1 || formData.duration > 10 ){
      setError('Duration must be between 1 and 10 days');
      setLoading(false);
      return;
    }

    const user = await account.get();
    if(!user.$id){
      console.log('User not authenticated');
      setLoading(false);
      return;
    };

    try{
      const response = await fetch('/api/create-trip', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
          country: formData.country,
          numberOfDays: formData.duration,
          travelStyle: formData.travelStyle,
          interests: formData.interest,
          budget: formData.budget,
          groupType: formData.groupType,
          userId: user.$id
        })
      })

      console.log('interest check:',response)
      const result: CreateTripResponse = await response.json();

      if(result?.id) navigate(`/trips/${result.id}`)
        else console.log('Failed to generate Trip')
    }catch(e){
      console.log("Error generating trip",e)
    } finally{
      setLoading(false)
    }

  }

  const handleChange = (key: keyof TripFormData, value: string | number ) => {
    setformData({...formData, [key]: value})
  }

  const countryData = countries.map((country) => ({
    text: country.name,
    value: country.value
  }));
  const mapData = [
    {
      country: formData.country,
      color: '#EA382E',
      coordianates: countries.find((c: Country) => c.name === formData.country)?.coordinates || [],    
    }
  ]
  

  return (
    <main className='flex flex-col gap-10 pb-20 wrapper'>
        <Header title='Add a ned Trip' description='View and edit AI genenrated Travel Plans' />
        <section className='mt-2.5 wrapper-md'>
            <form className='trip-form' onSubmit={handleSubmit}>
              {/*Combo Box for countries */}
              <div> 
                <label htmlFor="country">Country</label>
                <ComboBoxComponent 
                  id='country' 
                  dataSource={countryData} 
                  fields={{text: 'text', value: 'value'}} 
                  placeholder='Select a Country' 
                  className='combo-box'
                  value={formData.country}
                  change={(e: {value: string | undefined}) => {
                    if(e.value){
                      handleChange('country', e.value)
                    }
                  }}
                  allowFiltering
                  filtering={(e) => {
                    const query = e.text.toLowerCase();
                    e.updateData(
                      countries.filter((country) => country.name.toLocaleLowerCase().includes(query)).map(((country) => ({
                        text: country.name,
                        value: country.value
                      }))  )
                    )
                  }}
                />
              </div>
              {/* Duration Input box */}
              <div>
                <label htmlFor="duration">Duration</label>
                <input 
                  id='duration' 
                  name='duration' 
                  placeholder='Enter Duration or number of days (5, 12 ...)' 
                  className='form-input placeholder:text-gray-100' 
                  type="number" 
                  value={formData.duration || ''}
                  onChange={(e) => handleChange('duration', Number(e.target.value))} 
                />
              </div>
              
              {/* groupType, travelStyle, interest, budget are all done under here*/}
              {selectItems.map((key) => (
                <div key={key}>
                  <label htmlFor={key}>{formatKey(key)}</label>
                  <ComboBoxComponent 
                    id={key}
                    dataSource={comboBoxItems[key].map((item) => ({
                      text: item,
                      value: item,
                    }))}
                    fields={{text: 'text', value: 'value'}}
                    value={formData[key]} 
                    placeholder={`Select ${formatKey(key)}`}
                    change={(e: {value: string | undefined}) => {
                    if(e.value){
                      handleChange(key, e.value)
                    }
                  }}
                  allowFiltering
                  filtering={(e) => {
                    const query = e.text.toLowerCase();
                    e.updateData(
                      comboBoxItems[key].filter((item) => item.toLocaleLowerCase().includes(query)).map(((item) => ({
                        text: item,
                        value: item
                      }))  )
                    )
                  }}
                  className='combo-box'
                  />
                </div>
              ))}

              {/* Map implementation (try to implement from home to holiday destination)*/}
              <div>
                <label htmlFor="location">Location on the world map</label>
                <MapsComponent>
                  <LayersDirective>
                    <LayerDirective shapeData={world_map} dataSource={mapData} shapePropertyPath='name' shapeDataPath='country' shapeSettings={{colorValuePath: 'color', fill: '#E5E5E5'}}/>
                  </LayersDirective>
                </MapsComponent>
              </div>

              <div className='bg-gray-200 h-px w-full' />

              {error && (
                <div className='error'>
                  <p>{error}</p>
                </div>
              )}

              <footer className='px-6 w-full'>
                <ButtonComponent type='submit' className='button-class !h-12 !w-full' disabled={loading}>
                  <img src={`/assets/icons/${loading ? 'loader.svg' : 'magic-star.svg'}`} alt='generate trip' className={cn("size-5", {'animate-spin': loading})} />
                  <span className='p-16-semibold text-white'>{loading ? 'Generating...' : 'Generate Trip'}</span>
                </ButtonComponent>
              </footer>
            </form>
        </section>
    </main>
  )
}

export default createTrips