export interface Projects {
  _id: string;
  name_project: string;
  image_project: string;
  created_project?: Date;
  last_update_data?: Date;
  number_of_item?: string;
  numberPLI?: string;
  numberLPVa: string;
  user_id: string;
  product?: string;

  image_project_Landscape: string;
  image_project_Squared: string;
  domain_project: string;
  country_project: string;
  language_project: string;
  path_project: string;
  protocol_project: string;
  letter_thumbnails_project?: Array<{
    letter: string;
    color: string;
    background: string;
  }>;
}
