export const once = <T>(fn: () => T) => { 
  let v: T | undefined, ran = false; 
  return () => (ran ? v! : (ran = true, v = fn(), v)); 
};