"use client"
import React from 'react'
import { useEffect,useState} from 'react'



function page() {
  const [web5, setWeb5] = useState(null);
  const [myDid, setMyDid] = useState(null);

  const createProtocolDefinition = () => {
    const dingerProtocolDefinition = {
      protocol: "https://myprotocol.dev/chats",
      published: true,
      types: {
        ding: {
          schema: "https://blackgirlbytes.dev/ding",
          dataFormats: ["application/json"],
        },
      },
      structure: {
        ding: {
          $actions: [
            { who: "anyone", can: "write" },
            { who: "author", of: "ding", can: "read" },
            { who: "recipient", of: "ding", can: "read" },
          ],
        },
      },
    };
    return dingerProtocolDefinition;
  };

  const configureProtocol = async (web5, did) => {
    const protocolDefinition = await createProtocolDefinition();

    const { protocols: localProtocol, status: localProtocolStatus } = await queryForProtocol(web5);
    
    console.log({ localProtocol, localProtocolStatus });
    
    if (localProtocolStatus.code !== 200 || localProtocol.length === 0) {
        
      const { protocol, status } = await installProtocolLocally(web5, protocolDefinition);
      console.log("Protocol installed locally", protocol, status);
      const { status: configureRemoteStatus } = await protocol.send(did);
      console.log("Did the protocol install on the remote DWN?", configureRemoteStatus);
        
    } else {
      console.log("Protocol already installed");
    }
  };

  const queryForProtocol = async (web5) => {
    return await web5.dwn.protocols.query({
      message: {
        filter: {
          protocol: "https://myprotocol.dev/chats",
        },
      },
    });
  };

  const installProtocolLocally = async (web5, protocolDefinition) => {
    return await web5.dwn.protocols.configure({
      message: {
        definition: protocolDefinition,
      },
    });
  };

  const initWeb5 = async () => {
      
    // @ts-ignore
    const { Web5 } = await import('@web5/api');

    try {
    
      const { web5, did } = await Web5.connect({sync: '5s'});
      setWeb5(web5);
      setMyDid(did);
      console.log(did.privateKey);
      
      if (web5 && did) {
        console.log('Web5 initialized');
        await configureProtocol(web5, did);
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