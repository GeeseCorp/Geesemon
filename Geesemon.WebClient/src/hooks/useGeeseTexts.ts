import { useAppSelector } from '../behavior/store';

export function useGeeseTexts() {  
  const texts = useAppSelector(state => state.settings.geeseTexts);    
    
  return texts;
}