# Context

There a 4 CSV files attached below. Each file represents a table as following

- diagnostic_groups - “groups” of diagnostics, used for easy assignment to a patient and display. e.g “Cholesterol Panel”
- diagnostics - individual tests that you could get done, e.g in Cholesterol Panel you may have HDL, LDL and Total Cholesterol
- diagnostic_metrics - specific metrics associated with a diagnostic, sometimes there are multiple metrics for one diagnostic.
    - Metrics also contain reference ranges of the form standard_lower → standard_higher and everlab_lower → everlab_higher. These indicate the “standard” and “everlab” acceptable values for results in these ranges.
    - Metrics are sometimes personalised based on min_age → max_age and gender. If values are given for a metric we should use the most specific age/gender based reference ranges.
    - oru_sonic_codes and oru_sonic_units fields are `;` delimited fields of possible ORU values that can match to the metric. We need to match on both code and units to get the right reference range.
- conditions - these are possible diagnoses or issues that someone may have based on abnormal metrics. We suggest relevant conditions as a possibility for a doctor to then choose if they agree with or not.

### Files

conditions.csv

diagnostic_metrics.csv

diagnostics.csv

diagnostic_groups.csv

MP826520.oru.txt - note this has lines separated by carriage returns. Your editor may make changes that break it
