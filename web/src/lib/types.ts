export type MediaType = 'photo' | 'video' | 'audio';
export type EntryStatus = 'draft' | 'approved' | 'published';

export interface Media {
  id:                string;
  entry_id:          string | null;
  type:              MediaType;
  sort_order:        number;
  storage_key:       string;
  url:               string;
  caption:           string | null;
  width:             number | null;
  height:            number | null;
  duration_s:        number | null;
  mime_type:         string | null;
  size_bytes:        number | null;
  status:            EntryStatus;
  source_channel:    string | null;
  source_message_id: string | null;
  taken_at:          string | null;
  created_at:        string;
}

export interface Place {
  id:          string;
  name:        string;
  name_jp:     string | null;
  type:        'restaurant' | 'temple' | 'park' | 'museum' | 'shop' | 'other';
  city:        string | null;
  address:     string | null;
  coordinates: { lat: number; lng: number } | null;
  category:    string | null;
  rating:      number | null;
  price_range: string | null;
  description: string | null;
  google_maps_url: string | null;
  official_url: string | null;
  visited_at:  string | null;
  created_at:  string;
}

export interface Entry {
  id:                string;
  date:              string;
  day_number:        number | null;
  sort_order:        number;
  title:             string;
  body:              string;
  location:          string | null;
  city:              string | null;
  coordinates:       { lat: number; lng: number } | null;
  mood:              string | null;
  tags:              string[];
  status:            EntryStatus;
  review_notes:      string | null;
  source_channel:    string | null;
  source_message_id: string | null;
  source_timestamp:  string | null;
  created_at:        string;
  updated_at:        string;
  media:             Media[];
  places:            Place[];
}

export interface DayContext {
  date:    string;
  entries: Entry[];
  places:  Place[];
}

export interface DaySummary {
  date:           string;
  day_number:     number | null;
  entry_count:    number;
  media_count:    number;
  has_published:  boolean;
  has_drafts:     boolean;
  city:           string | null;
}

export interface FeedResponse {
  entries: Entry[];
  total:   number;
  limit:   number;
  offset:  number;
}

export interface Stats {
  days:           number;
  entries:        number;
  places:         number;
  photos:         number;
  pending_drafts: number;
}
