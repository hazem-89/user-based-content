import { Avatar, Box, Button, Container, Drawer, Grid, IconButton, Paper, SxProps, TextField, Tooltip, Typography, } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useContext, useEffect, useRef, useState } from "react";
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled } from "@mui/system";
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { APIContext } from "../Context/AuthContext";
import edit from "material-ui/svg-icons/image/edit";
import React from "react";
import axios, { AxiosResponse } from "axios";



interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}
interface Props {

}

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    justifyContent: 'flex-start',
}));



const UserInfo: React.FC<Props> = () => {
    // const [postValue, setPostValue] = useState('')
    const [open, setOpen] = React.useState(false);
    const [userPosts, setUserPosts] = useState([]);
    const [description, setDescription] = useState<string>("")
    const desc = useRef();

    const ctx = useContext(APIContext);
    console.log(ctx?.id);

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    let drawerWidth
    if (!open) {
        drawerWidth = '0%'
    } else {
        drawerWidth = '100%'
    }
    let drawerHeight
    if (!open) {
        drawerHeight = '0%'
    } else {
        drawerHeight = '100%'
    }

    useEffect(() => {
        async function fetchData() {
          const { data } = await axios.get(`http://localhost:4000/posts/profile/` + ctx?.id);
          setUserPosts(data);
        }
        fetchData();
    }, [ctx?.id]);
    console.log(userPosts);

    async function editPost() {
        await axios.put("http://localhost:4000/", {
            description
          }, {
            withCredentials: true
          }).then((res: AxiosResponse) => {
            if (res.data === "success") {
              console.log('suc');
            }
          }, () => {
            console.log("Failure");
          })
      }
      const textInput = React.useRef(null);

      const submitHandler = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const newPost = {
            userId: ctx?.id,
            description,
        };
        try {
          await axios.post("http://localhost:4000/posts", newPost);
          window.location.reload();
        } catch (err) {
            console.log("Failure")
        }
      };

    return (
        <Container>
            <Box>
                <Box sx={profile}>
                <Typography sx={profileText}>
                {ctx?.username}
                </Typography>
                <Avatar />
                </Box>
                <Tooltip 
                title="Edit"
                // sx={edit}
                >
                <Button onClick={handleDrawerOpen}
                    sx={{ ...(open && { display: '' }) }}>
                <EditIcon 
                sx={editIcon}/>
                </Button>
                </Tooltip>

                <Drawer
                sx={{
                position: 'absolute',
                flexShrink: 0,
                    '& .MuiDrawer-paper': {
                    marginTop: '10rem',
                    marginRight: '20rem',
                    width: { xs: drawerWidth, sm: '35%', md: '25%', lg: '50%' },
                    height: { xs: drawerWidth, sm: '40%', md: '40%', lg: '40%' },
                    backgroundColor: '#fff',
                    borderRadius: '20px'
                    },
                }}
                variant="persistent"
                anchor="right"
                open={open}
                > 
                 <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                <CloseIcon sx={iconStyle} />
                </IconButton>
                </DrawerHeader>
                    <Typography sx={profileText}>
                        User Profile
                    </Typography>
                    <Avatar />

                    </Drawer> 
                </Box>
               

               <Drawer
                    sx={{
                        position: 'absolute',
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            marginTop: '10rem',
                            marginRight: '20rem',
                            width: { xs: drawerWidth, sm: '50%', md: '50%', lg: '50%' },
                            height: { xs: drawerWidth, sm: '40%', md: '40%', lg: '40%' },
                            backgroundColor: '#fff',
                            borderRadius: '20px'
                        },
                    }}
                    variant="persistent"
                    anchor="right"
                    open={open}
                >
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            <CloseIcon sx={iconStyle} />
                        </IconButton>
                        <Typography sx={editText}>Edit post</Typography>
                    </DrawerHeader>

                    <TextField  variant="standard">

                    </TextField>
                    <Button type="submit" sx={confirmBtn}>Confirm</Button>

                </Drawer> 
                <Button>
                    <PersonRemoveIcon onClick={handleDrawerOpen}
                        sx={{ ...(open && { display: '' }), fontSize: '3rem', marginTop: '1rem', color: 'red' }} />
                </Button>
                <Typography>Delete User</Typography>
                <Drawer
                    sx={{
                        position: 'absolute',
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            marginTop: '10rem',
                            marginRight:{ xs: '1.5rem', sm: '8rem', lg:'20rem' },
                            width: { xs: '90%', sm: '50%', md: '50%', lg: '50%' },
                            height: { xs: '50%', sm: '50%', md: '40%', lg: '40%' },
                            backgroundColor: '#ECECEC',
                            borderRadius: '20px'
                        },
                    }}
                    variant="persistent"
                    anchor="right"
                    open={open}
                >
                    <DrawerHeader >
                        <IconButton onClick={handleDrawerClose}>
                            <CloseIcon sx={iconStyle} />
                        </IconButton>
                        <Typography sx={editText}>Are you sure you want to delete this account?</Typography>
                    </DrawerHeader>
                    <Button type="button" sx={confirmBtn} onClick={() => {handleDrawerClose();}}>No</Button>
                    <Button type="button" sx={confirmBtn} onClick={() => {console.log('deleted user')}}>Yes</Button>
                </Drawer>

                <Box>
                    <Typography sx={userText}>Create Post</Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        type="text"
                        value={description}
                        inputRef={textInput}
                        onChange={e => setDescription(e.target.value)}
                        />
                    <Button
                        onClick={submitHandler}
                        type='submit'
                        sx={button}>
                         Post
                    </Button>
                </Box>
                <Box >
            {userPosts.map((post: any) => (
                <Box  key={post._id}>
                    <Paper elevation={3} >
                        <Box >
                            <Typography variant="h5">{post.description}</Typography>
                            <Typography></Typography>
                        </Box>
                    </Paper>
                    <Paper  elevation={3}>
                        <Typography  variant="h6">
                            {ctx?.username}
                        </Typography>
                    </Paper>
                </Box>
            ))}
        </Box>
        </Container>
        
    );
}

const confirmBtn: SxProps = {
    backgroundColor: '#A1BFED',
    color: 'black',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '1rem',
    width: '5rem'
}
const deleteBtn: SxProps = {
    float: 'right',
    color: 'red'
}

const drawer: SxProps = {
    backgroundColor: '#D3D3D3'
}
const editText: SxProps = {
    fontSize: '2rem',
    marginLeft: '2rem',
}
const userInfo: SxProps = {
    backgroundColor: '#E5E5E5',
    width: '100%',
    height: '30rem',
}
const textfield: SxProps = {
    marginTop: '3rem',
    width: '100%',
}
const newPost: SxProps = {
    backgroundColor: '#E5E5E5',
    width: '100%',
    height: '15rem',
    marginBottom: '1rem'
}
const text: SxProps = {
    marginTop: '3rem',
    fontSize: '2rem'
}
const userText: SxProps = {
    marginTop: '3rem',
    fontSize: '2rem'
}
const profile: SxProps = {
    marginTop: '3rem',
    display: 'flex',
    flexDirection: 'row',
}
const profileText: SxProps = {
    fontSize: '2rem',
    marginRight: '1rem'
}
const editIcon: SxProps = {
    cursor: 'pointer',
    color: 'blue',
}
const buttonAlign: SxProps = {
    display: 'flex',
    justifyContent: 'flex-end'
}
const button: SxProps = {
    backgroundColor: '#A1BFED',
    fontSize: '1rem',
    color: 'black',
    width: '10rem',
    height: '3rem',
    marginBottom: '2rem',
    float: 'right'
}
const iconStyle: SxProps = {
    fontSize: '2rem',
    color: 'black'
}




export default UserInfo;