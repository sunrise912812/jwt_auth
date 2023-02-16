class UserDto{
    email;
    id;
    isActivated;

    constructor(model){
        this.email = model.email
        this.id = model._id //Нижнее почеркивание т.к MongoDB добавляет его чтобы обозначить что поле не изменяемое, пожтому нам тоже нужно указать с нижним почеркиванием
        this.isActivated = model.isActivated
    }
}

export default UserDto