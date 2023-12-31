"use client"
import React from 'react'
import { useEffect,useState} from 'react'



function page() {
  const [web5, setWeb5] = useState(null);
  const [myDid, setMyDid] = useState(null);

  const initWeb5 = async () => {
      
    // @ts-ignore
    const { Web5 } = await import('@web5/api');

    try {
    
      const { web5, did } = await Web5.connect({sync: '5s'});
      setWeb5(web5);
      setMyDid(did);
      console.log(web5);
      if (web5 && did) {
        console.log('Web5 initialized');
        // await configureProtocol(web5, did);
      }
    } catch (error) {
      console.error('Error initializing Web5:', error);
    }
  };

  

  return (<>
    <div>page</div>
    <button onClick={initWeb5}>clicke</button>
    {web5 ?(<div>{myDid}</div>):(<div></div>)}
  </>
  )
}

export default page