/**
 * Returns a list grouped by the month and year combination specified in the group_by_range parameter along with the addition/sum of values from group_by_values parameter.
 * If the result needs to be filtered further specify the column number in the filter_col_number parameter along with the list of values separated by a comma that need to be matched in the filter_text parameter.
 *
 * @param {Range} range The full data range on which the grouping operation is applied.
 * @param {Range} group_by_range The range whose values are considered for grouping.
 * @param {Range} group_by_values The range whose values are considered for addition/sum while grouping.
 * @param {String} filter_text The list of string values separated by a comma which will be used to include only the results that match the value.
 * @param {Number} filter_col_number The column number on which the filter_text string will be matched to include only those results.
 * 
 * @returns {Range} A list of grouped results based on the parameters specified.
 * @customfunction
 */
function GROUP_BY_MONTH_YEAR(range, group_by_range, group_by_values, filter_text, filter_col_number) {

  let errorMessage = '';

  try {

    if (group_by_range.length !== group_by_values.length) {

      throw new Error('Length of group_by_range and group_by_values arguments do not match.');

    }

    let groupedData = {};
    const monthNameMapping = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Creating object grouped by the group_by_range and the sum of their respective values based on group_by_values.
    for (let i = 0; i < range.length; i++) {

      const record = range[i];
      const date = group_by_range[i][0];
      if (!date) continue;

      if (filter_text && filter_col_number) {
        const brokersList = filter_text.split(",");
        let considerRowToCalculate = false;
        for (const value of brokersList) {
          if (record[filter_col_number - 1] === value) considerRowToCalculate = true;
        }
        if(!considerRowToCalculate) continue;
      }

      const monthYear = new Date(date).getMonth() + "-" + new Date(date).getFullYear();
      const amount = group_by_values[i][0];

      if (!groupedData[monthYear]) {

        groupedData[monthYear] = {};
        groupedData[monthYear].total = 0;

      }

      groupedData[monthYear].total += amount;

    }

    // Creating the grouped result in the 2D array format
    const result = [];
    const objectKeys = Object.keys(groupedData);

    for (const key of objectKeys) {

      const monthYearSplit = key.split("-");
      const monthName = monthNameMapping[monthYearSplit[0]];
      const formattedMonthYear = monthName + " " + monthYearSplit[1];
      result.push([formattedMonthYear, groupedData[key].total]);

    }

    if (result.length === 0) return "";
    
    return result.reverse();

  } catch (error) {

    errorMessage = error.message;
    throw errorMessage;

  }

}
