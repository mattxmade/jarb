export type FormInputError = {
    [index: string]: any;
    input: string;
    errors: Array<string>;
};

export type ReedSearchResponse = {
    results: JobSearchResult[];
    ambiguousLocations: any;
    totalResults: number;
};

export type JobSearchResult = {
    [index: string]: number | string | null;
    jobId: number;
    employerId: number;
    employerName: string;
    employerProfileId: number | null;
    employerProfileName: string | null;
    jobTitle: string;
    locationName: string;
    minimumSalary: number | null;
    maximumSalary: number | null;
    currency: string | null;
    expirationDate: string;
    date: string;
    jobDescription: string;
    applications: number;
    jobUrl: string;
};

export type JobSearchFields = {
    id: string;
    [index: string]: string | number | boolean | undefined;

    query: string;

    keywords?: string;
    employerProfileId?: string;

    locationName?: string;
    distanceFromLocation?: number;

    fulltime?: boolean;
    partTime?: boolean;

    minimumSalary?: number;
    maximumSalary?: number;

    temp?: boolean;
    contract?: boolean;
    permanent?: boolean;
    graduate?: boolean;

    postedByDirectEmployer?: boolean;
    postedByRecruitmentAgency?: boolean;
};

// Reed API | https://www.reed.co.uk/developers/Jobseeker

/*
    keywords                  => text
    employerProfileId         => text

    locationName              => text
    distanceFromLocation      => number (deafult 10)

    fulltime                  => toggle (boolean)
    partTime                  => toggle (boolean)        

    minimumSalary             => number (e.g. 20000)
    maximumSalary             => number (e.g. 30000)

    temp                      => toggle (boolean)
    graduate                  => toggle (boolean)      
    contract                  => toggle (boolean)
    permanent                 => toggle (boolean)

    postedByDirectEmployer    => toggle (boolean)
    postedByRecruitmentAgency => toggle (boolean)

    resultsToTake             => number (default 100)
    resultsToSkip             => number (pagination)
*/
