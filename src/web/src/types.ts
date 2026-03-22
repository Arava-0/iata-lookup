export interface Airport {
	id:                 string;
	ident:              string;
	type:               string;
	name:               string;
	latitude_deg:       string;
	longitude_deg:      string;
	elevation_ft:       string;
	continent:          string;
	iso_country:        string;
	iso_region:         string;
	municipality:       string;
	scheduled_service:  string;
	icao_code:          string;
	iata_code:          string;
	gps_code:           string;
	home_link:          string;
	wikipedia_link:     string;
	keywords:           string;
}

export interface Runway {
	id:                       string;
	airport_ident:            string;
	length_ft:                string;
	width_ft:                 string;
	surface:                  string;
	lighted:                  string;
	closed:                   string;
	le_ident:                 string;
	le_latitude_deg:          string;
	le_longitude_deg:         string;
	le_elevation_ft:          string;
	le_heading_degT:          string;
	le_displaced_threshold_ft: string;
	he_ident:                 string;
	he_latitude_deg:          string;
	he_longitude_deg:         string;
	he_elevation_ft:          string;
	he_heading_degT:          string;
	he_displaced_threshold_ft: string;
}

export interface Frequency {
	id:            string;
	airport_ident: string;
	type:          string;
	description:   string;
	frequency_mhz: string;
}

export interface Navaid {
	id:                  string;
	ident:               string;
	name:                string;
	type:                string;
	frequency_khz:       string;
	latitude_deg:        string;
	longitude_deg:       string;
	elevation_ft:        string;
	iso_country:         string;
	magnetic_variation_deg: string;
	usageType:           string;
	power:               string;
	associated_airport:  string;
}

export type Zone = "EURO" | "MOYEN" | "LONG";

export interface IataEntry {
	iata_code:    string;
	icao_code:    string;
	name:         string;
	municipality: string;
	country_name: string;
	country_code: string;
	airport_type: string;
	zone:         Zone;
}
