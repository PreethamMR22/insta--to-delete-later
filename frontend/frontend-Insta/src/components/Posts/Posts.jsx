import React, { useState } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Avatar, 
  Card, 
  CardHeader, 
  CardContent, 
  CardActions, 
  Button,
  TextField
} from '@mui/material';
import { 
  Home as HomeIcon, 
  Send as SendIcon, 
  AddBoxOutlined as AddBoxOutlinedIcon, 
  ExploreOutlined as ExploreOutlinedIcon, 
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  SendOutlined as SendOutlinedIcon,
  BookmarkBorder as BookmarkBorderIcon,
  MoreVert as MoreVertIcon,
  SentimentSatisfiedOutlined as SentimentSatisfiedOutlinedIcon
} from '@mui/icons-material';

const Posts = () => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(1243);
  const [comments, setComments] = useState(42);
  const [shares, setShares] = useState(18);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      // In a real app, this would add the comment to the database
      setComments(comments + 1);
      setComment('');
    }
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    setShares(shares + 1);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar position="fixed" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
        <Toolbar sx={{ 
          justifyContent: 'space-between', 
          maxWidth: 975, 
          width: '100%', 
          mx: 'auto',
          px: { xs: 2, sm: 4 }
        }}>
          <Typography variant="h6" component="div" sx={{ 
            fontWeight: 'bold',
            fontFamily: '"Dancing Script", cursive',
            fontSize: '1.5rem'
          }}>
            Instagram
          </Typography>
          
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
            <IconButton color="inherit" size="large">
              {/* <HomeIcon /> */}
            </IconButton>
            <IconButton color="inherit" size="large">
              {/* <SendIcon /> */}
            </IconButton>
            <IconButton color="inherit" size="large">
              <AddBoxOutlinedIcon />
            </IconButton>
            <IconButton color="inherit" size="large">
              <ExploreOutlinedIcon />
            </IconButton>
            <IconButton color="inherit" size="large">
              <Avatar sx={{ width: 24, height: 24 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box 
        sx={{ 
          pt: { xs: 8, sm: 9 },
          maxWidth: 614,
          mx: 'auto',
          width: '100%',
          px: { xs: 0, sm: 2 },
          '& .MuiCard-root': {
            borderRadius: { xs: 0, sm: 1 },
            borderWidth: { xs: 0, sm: '1px' },
            mb: { xs: 0, sm: 3 },
          }
        }}
      >
        {/* Single Post */}
        <Card 
          elevation={0} 
          sx={{ 
            mb: 3, 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden'
          }}
        >
          {/* Post Header */}
          <CardHeader
            avatar={
              <Avatar 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt="username" 
                sx={{ width: 32, height: 32 }}
              />
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title="Siht Si Macs"
            titleTypographyProps={{ 
              variant: 'subtitle2',
              sx: { fontWeight: 600 }
            }}
            sx={{ 
              p: 2,
              '& .MuiCardHeader-action': { m: 0 }
            }}
          />
          
          {/* Video Content */}
          <Box 
            sx={{
              position: 'relative',
              width: '100%',
              paddingBottom: '177.78%', /* 9:16 Aspect Ratio */
              backgroundColor: '#000',
              overflow: 'hidden',
              '@media (max-width: 600px)': {
                paddingBottom: 'calc(100vh - 56px)', /* Full viewport height minus header */
                maxHeight: 'calc(100vh - 56px)',
              }
            }}
          >
            <Box
              component="video"
              src="/src/assets/SHOCK moment Brazilian plane crash kills all on board.mp4"
              controls
              autoPlay
              playsInline
              muted
              loop
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                '@media (max-width: 600px)': {
                  width: 'auto',
                  height: '100%',
                  maxWidth: '100%',
                }
              }}
              sx={{
                '&::-webkit-media-controls-panel': {
                  padding: '16px',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                },
                '&::-webkit-media-controls-play-button': {
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                },
                '&::-webkit-media-controls-current-time-display, &::-webkit-media-controls-time-remaining-display': {
                  color: '#fff',
                  textShadow: '0 0 4px rgba(0,0,0,0.5)',
                }
              }}
            />
          </Box>
          
          {/* Action Buttons */}
          <CardActions sx={{ 
            px: { xs: 1, sm: 2 }, 
            pt: 1, 
            pb: 0,
            '& .MuiIconButton-root': {
              p: { xs: 1, sm: 1.5 },
              '&:last-child': {
                ml: 'auto'
              }
            }
          }}>
            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
              <IconButton onClick={handleLike} size="large">
                {liked ? 
                  <FavoriteIcon color="error" /> : 
                  <FavoriteBorderIcon />
                }
              </IconButton>
              <IconButton onClick={() => setShowComments(!showComments)} size="large">
                <ChatBubbleOutlineIcon />
              </IconButton>
              <IconButton onClick={handleShare} size="large">
                <SendOutlinedIcon />
              </IconButton>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton size="large">
                <BookmarkBorderIcon />
              </IconButton>
            </Box>
          </CardActions>
          
          {/* Likes and Caption */}
          <CardContent sx={{ 
            pt: 0, 
            px: { xs: 1.5, sm: 2 }, 
            pb: 1,
            '& .MuiTypography-body2': {
              fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              lineHeight: 1.4
            }
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              {likes.toLocaleString()} likes
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <Box component="span" sx={{ fontWeight: 600, mr: 1 }}>username</Box>
              This is a sample Instagram post with a video. Double tap to like! ❤️
            </Typography>
            <Typography 
              variant="body2" 
              color="textSecondary" 
              onClick={() => setShowComments(!showComments)}
              sx={{ 
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
                fontSize: '0.875rem',
                color: 'text.secondary'
              }}
            >
              View all {comments} comments
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
              2 HOURS AGO
            </Typography>
          </CardContent>
          
          {/* Add Comment */}
          <Box component="form" onSubmit={handleComment} sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SentimentSatisfiedOutlinedIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <TextField
                fullWidth
                variant="standard"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  sx: { 
                    fontSize: '0.875rem',
                    '& input::placeholder': {
                      color: 'text.secondary',
                      opacity: 1
                    }
                  }
                }}
                sx={{ 
                  '& .MuiInputBase-root': { 
                    p: 0,
                    '&:before, &:after': { display: 'none' }
                  }
                }}
              />
              <Button 
                type="submit" 
                color="primary" 
                disabled={!comment.trim()}
                sx={{ 
                  minWidth: 'auto',
                  p: 0,
                  ml: 1,
                  color: 'primary.light',
                  fontWeight: 600,
                  opacity: comment.trim() ? 1 : 0.5,
                  '&:disabled': {
                    color: 'primary.light',
                    opacity: 0.3
                  }
                }}
              >
                Post
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Posts;
