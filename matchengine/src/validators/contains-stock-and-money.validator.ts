import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

export function ContainsStockAndMoney(
  stock: string,
  money: string,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ContainsStockAndMoney',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [stock, money],
      options: {
        message: `${propertyName} must contain ${stock} and ${money}`,
        ...validationOptions
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [stock, money] = args.constraints;
          const stockValue = (args.object as any)[stock];
          const moneyValue = (args.object as any)[money];
          const market = (args.object as any).market;
          return market?.includes(stockValue) && market?.includes(moneyValue);
        },
      }
    });
  };
}
