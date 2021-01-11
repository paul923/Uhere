const LocationService = () => {
    let subscribers = []
    let location = {
      latitude: 0,
      longitude: 0
    }
    let goalin = false;
  
    return {
      subscribe: (sub) => subscribers.push(sub),
      setGoalin: (bool) => {
        goalin = bool
        subscribers.forEach((sub) => sub(goalin))
      },
      setLocation: (coords) => {
        location = coords
        subscribers.forEach((sub) => sub(location))
      },
      unsubscribe: (sub) => {
        subscribers = subscribers.filter((_sub) => _sub !== sub)
      }
    }
  }
  
  export const locationService = LocationService()