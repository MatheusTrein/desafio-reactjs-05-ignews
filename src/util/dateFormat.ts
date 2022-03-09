interface FormatedDate {
  date: string;
  dateAndTime: string;
}

export const dateFormat = (data: string): FormatedDate => {
  const day = new Date(data).toLocaleDateString('pt-BR', { day: '2-digit' });
  const month = ((): string => {
    const monthString = new Date(data)
      .toLocaleDateString('pt-BR', { month: 'long' })
      .slice(0, 3);

    // const monthStringCapitalize = `${monthString[0].toUpperCase()}${
    //   monthString[1]
    // }${monthString[2]}`;

    return monthString;
  })();
  const year = new Date(data).toLocaleDateString('pt-BR', { year: 'numeric' });
  const time = new Date(data).toLocaleTimeString('pt-BR').slice(0, 5);

  return {
    date: `${day} ${month} ${year}`,
    dateAndTime: `${day} ${month} ${year} às ${time}`,
  };
};
