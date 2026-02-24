import { supabase } from './supabase';
import type { Person, Family, Profile, CreatePersonInput, UpdatePersonInput } from '@/types';

// ═══════════════════════════════════════════════════════════════════════════
// People CRUD
// ═══════════════════════════════════════════════════════════════════════════

export async function getPeople(): Promise<Person[]> {
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .order('generation', { ascending: true })
    .order('display_name', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function getPerson(id: string): Promise<Person | null> {
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function getPersonByHandle(handle: string): Promise<Person | null> {
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('handle', handle)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function createPerson(input: CreatePersonInput): Promise<Person> {
  const { data, error } = await supabase
    .from('people')
    .insert(input)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updatePerson(id: string, input: UpdatePersonInput): Promise<Person> {
  const { data, error } = await supabase
    .from('people')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deletePerson(id: string): Promise<void> {
  const { error } = await supabase
    .from('people')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function searchPeople(query: string): Promise<Person[]> {
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .ilike('display_name', `%${query}%`)
    .order('display_name', { ascending: true })
    .limit(20);
  
  if (error) throw error;
  return data || [];
}

export async function getPeopleByGeneration(generation: number): Promise<Person[]> {
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('generation', generation)
    .order('display_name', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

// ═══════════════════════════════════════════════════════════════════════════
// Families CRUD
// ═══════════════════════════════════════════════════════════════════════════

export async function getFamilies(): Promise<Family[]> {
  const { data, error } = await supabase
    .from('families')
    .select('*')
    .order('sort_order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function getFamily(id: string): Promise<Family | null> {
  const { data, error } = await supabase
    .from('families')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function getFamilyChildren(familyId: string): Promise<Person[]> {
  const { data, error } = await supabase
    .from('children')
    .select('person_id, sort_order')
    .eq('family_id', familyId)
    .order('sort_order', { ascending: true });
  
  if (error) throw error;
  if (!data || data.length === 0) return [];
  
  const personIds = data.map(c => c.person_id);
  const { data: people, error: peopleError } = await supabase
    .from('people')
    .select('*')
    .in('id', personIds);
  
  if (peopleError) throw peopleError;
  
  // Sort by original order
  const orderMap = new Map(data.map(c => [c.person_id, c.sort_order]));
  return (people || []).sort((a, b) => 
    (orderMap.get(a.id) || 0) - (orderMap.get(b.id) || 0)
  );
}

export async function createFamily(input: Omit<Family, 'id' | 'created_at' | 'updated_at'>): Promise<Family> {
  const { data, error } = await supabase
    .from('families')
    .insert(input)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function addChildToFamily(familyId: string, personId: string, sortOrder: number): Promise<void> {
  const { error } = await supabase
    .from('children')
    .insert({ family_id: familyId, person_id: personId, sort_order: sortOrder });
  
  if (error) throw error;
}

export async function removeChildFromFamily(familyId: string, personId: string): Promise<void> {
  const { error } = await supabase
    .from('children')
    .delete()
    .eq('family_id', familyId)
    .eq('person_id', personId);
  
  if (error) throw error;
}

// ═══════════════════════════════════════════════════════════════════════════
// Profiles (Users)
// ═══════════════════════════════════════════════════════════════════════════

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function getProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function updateProfile(userId: string, input: Partial<Profile>): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateUserRole(userId: string, role: Profile['role']): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ═══════════════════════════════════════════════════════════════════════════
// Statistics
// ═══════════════════════════════════════════════════════════════════════════

export async function getStats(): Promise<{
  totalPeople: number;
  totalGenerations: number;
  totalChi: number;
  livingCount: number;
  deceasedCount: number;
}> {
  const { data: people, error } = await supabase
    .from('people')
    .select('id, generation, chi, is_living');
  
  if (error) throw error;
  
  const generations = new Set(people?.map(p => p.generation) || []);
  const chis = new Set(people?.filter(p => p.chi).map(p => p.chi) || []);
  const living = people?.filter(p => p.is_living).length || 0;
  const deceased = people?.filter(p => !p.is_living).length || 0;
  
  return {
    totalPeople: people?.length || 0,
    totalGenerations: generations.size,
    totalChi: chis.size,
    livingCount: living,
    deceasedCount: deceased,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// Family Tree Data
// ═══════════════════════════════════════════════════════════════════════════

export interface TreeData {
  people: Person[];
  families: Family[];
  children: { family_id: string; person_id: string; sort_order: number }[];
}

export async function getTreeData(): Promise<TreeData> {
  const [peopleRes, familiesRes, childrenRes] = await Promise.all([
    supabase.from('people').select('*'),
    supabase.from('families').select('*'),
    supabase.from('children').select('family_id, person_id, sort_order'),
  ]);
  
  if (peopleRes.error) throw peopleRes.error;
  if (familiesRes.error) throw familiesRes.error;
  if (childrenRes.error) throw childrenRes.error;
  
  return {
    people: peopleRes.data || [],
    families: familiesRes.data || [],
    children: childrenRes.data || [],
  };
}
